FROM python:3.10-slim

# COPY ./src /app/

VOLUME /app

COPY ./requirements.txt /app/

WORKDIR /app

RUN pip install -r requirements.txt

# CMD ["python", "bike.py"]

# cli test with entrypoint
# ENTRYPOINT ["python", "cli.py", "start", "--num-bikes", "5"]
CMD ["python", "cli.py", "start", "--num-bikes", "3000"]

# Freeze program on startup
# CMD ["tail", "-f", "/dev/null"]
#xx