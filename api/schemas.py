from pydantic import BaseModel, Field
from typing import List


class FireInput(BaseModel):

    X: int = Field(...)

    Y: int = Field(...)

    month: str

    day: str

    FFMC: float

    DMC: float

    DC: float

    ISI: float

    temp: float

    RH: float

    wind: float

    rain: float


class BatchInput(BaseModel):

    records: List[FireInput]