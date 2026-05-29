from fastapi import FastAPI

from api.schemas import FireInput

from api.predictor import FirePredictor

from api.schemas import BatchInput

from fastapi.middleware.cors import CORSMiddleware

#  main file

app = FastAPI(
    title="Forest Fire Prediction API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", ...],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

predictor = FirePredictor()

@app.get("/")
def home():

    return {
        "message": "Forest Fire Prediction API Running"
    }


@app.post("/predict")
def predict_fire(data: FireInput):

    result = predictor.predict(data.dict())

    return result


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }


@app.post("/predict/batch")
def predict_batch(data: BatchInput):

    results = []

    for record in data.records:

        result = predictor.predict(record.dict())

        results.append(result)

    return results


@app.post("/predict/explain")
def explain_prediction(data: FireInput):

    prediction = predictor.predict(data.dict())

    explanations = predictor.explain(data.dict())

    return {
        "prediction": prediction,
        "explanations": explanations
    }