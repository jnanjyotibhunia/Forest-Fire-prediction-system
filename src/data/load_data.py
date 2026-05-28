import pandas as pd

# Load dataset
df = pd.read_csv("data/raw/forestfires.csv")

print(df.head())

print("\nShape:")
print(df.shape)

print("\nColumns:")
print(df.columns)

print("\nMissing Values:")
print(df.isnull().sum())