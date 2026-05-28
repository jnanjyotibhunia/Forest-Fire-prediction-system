import joblib
import pandas as pd
import numpy as np
import json


class FirePredictor:

    def __init__(self):

        self.model = joblib.load("models/fire_model.pkl")

        self.scaler = joblib.load("models/scaler.pkl")

        with open("models/model_metadata.json") as f:
            self.metadata = json.load(f)

        self.threshold = self.metadata["threshold"]

        self.features = self.metadata["features"]

    def preprocess(self, data):

        df = pd.DataFrame([data])

        # Feature engineering
        df["dryness_index"] = df["temp"] / (df["RH"] + 1)

        df["humidity_deficit"] = 100 - df["RH"]

        df["no_rain"] = (df["rain"] == 0).astype(int)

        df["heat_stress"] = df["temp"] * df["wind"]

        df["vegetation_dryness"] = (
            df["FFMC"] * df["DMC"]
        )

        # Month encoding
        month_map = {
            "jan":1, "feb":2, "mar":3,
            "apr":4, "may":5, "jun":6,
            "jul":7, "aug":8, "sep":9,
            "oct":10, "nov":11, "dec":12
        }

        df["month_num"] = df["month"].map(month_map)

        # Day encoding
        day_map = {
            "mon":1,
            "tue":2,
            "wed":3,
            "thu":4,
            "fri":5,
            "sat":6,
            "sun":7
        }

        df["day_num"] = df["day"].map(day_map)

        # Cyclical encoding
        df["month_sin"] = np.sin(
            2 * np.pi * df["month_num"] / 12
        )

        df["month_cos"] = np.cos(
            2 * np.pi * df["month_num"] / 12
        )

        # Remove unused
        df.drop(columns=["month", "day"], inplace=True)

        # Reorder columns
        df = df[self.features]

        return df


    def predict(self, data):

        processed = self.preprocess(data)

        scaled = self.scaler.transform(processed)

        probability = self.model.predict_proba(scaled)[0][1]

        prediction = int(probability >= self.threshold)

        risk_level = self._risk_level(probability)

        return {
            "prediction": prediction,
            "fire_probability": round(
                float(probability), 4
            ),
            "risk_level": risk_level,
            "threshold": self.threshold
        }

    def _risk_level(self, prob):

        if prob < 0.25:
            return "LOW"

        elif prob < 0.50:
            return "MEDIUM"

        elif prob < 0.75:
            return "HIGH"

        return "EXTREME"
    

    def explain(self, data):

        explanations = []

        if data["temp"] > 30:
          explanations.append(
            "High temperature increases fire risk"
           )

        if data["RH"] < 30:
          explanations.append(
              "Low humidity dries vegetation"
           )

        if data["wind"] > 5:
           explanations.append(
              "Strong wind spreads fire rapidly"
            )

        if data["rain"] == 0:
           explanations.append(
              "No rainfall increases dryness"
           )

        # Default explanation
        if len(explanations) == 0:

           explanations.append(
            "Weather conditions currently indicate low wildfire risk"
           )

        return explanations