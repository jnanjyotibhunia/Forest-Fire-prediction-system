import pandas as pd
import numpy as np

df = pd.read_csv("data/processed/clean_forestfire.csv")

# Create target
df["fire"] = (df["area"] > 0).astype(int)

# Derived features
df["dryness_index"] = df["temp"] / (df["RH"] + 1)

df["humidity_deficit"] = 100 - df["RH"]

df["no_rain"] = (df["rain"] == 0).astype(int)

# Save
df.to_csv("data/processed/featured_dataset.csv", index=False)

print("Feature engineering complete.")
print(df.head())