# Use an official lightweight Python image
FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

# Copy requirement definition first (for caching)
COPY requirements.txt .

# Install dependencies
# We add "curl" for healthchecks
RUN apt-get update && apt-get install -y curl && \
    pip install --no-cache-dir -r requirements.txt

# Copy the actual application code
COPY src/ .

# Expose the port the app runs on
EXPOSE 8000

# The Command to start the Tribunal
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]