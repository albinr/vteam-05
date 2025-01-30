FROM python:3.10-slim

# Set the working directory inside the container
WORKDIR /app

# Copy only requirements first to leverage Docker's layer caching
COPY ./requirements.txt /app/requirements.txt

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set PYTHONPATH to ensure src can be discovered
ENV PYTHONPATH=/app

# Define the default command for the container
# CMD ["python", "cli.py", "start", "--num-bikes", "100"]
