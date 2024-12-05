FROM python:3.10-slim

COPY ./src /app/

# VOLUME /app

COPY ./requirements.txt /app/

WORKDIR /app

RUN pip install -r requirements.txt

# CMD ["python3", "simulation.py"]

# cli test with entrypoint
ENTRYPOINT ["python", "cli.py"]