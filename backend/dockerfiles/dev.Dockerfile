# syntax=docker.io/docker/dockerfile-upstream:1.2.0
# =========================================================
# === Build Backend Base                                ===
# =========================================================
FROM mcr.microsoft.com/vscode/devcontainers/python:0-3.9
#FROM python:3.9-alpine

ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE 1

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
  # dependencies for building Python packages
  build-essential \
  # psycopg2 dependencies
  libpq-dev \
  # Translations dependencies
  gettext \
  # opencv dependencies
  ffmpeg libsm6 libxext6 \
  && rm -rf /var/lib/apt/lists/*

# =========================================================
# === Build Backend Production                          ===
# =========================================================

WORKDIR /app

RUN python -m pip install --upgrade pip
RUN pip install poetry
ENV POETRY_VIRTUALENVS_CREATE=false

# Allow user to manage deps in dev container
COPY ./backend/pyproject.toml pyproject.toml
COPY ./backend/poetry.lock poetry.lock
RUN poetry export -f requirements.txt -o requirements.txt --dev --without-hashes
RUN --mount=type=cache,target=/root/.cache/pip \
  pip install -r ./requirements.txt

COPY ./backend/entrypoints/entrypoint /entrypoint
RUN sed -i 's/\r$//g' /entrypoint
RUN chmod +x /entrypoint

COPY ./backend/entrypoints/start /start
RUN sed -i 's/\r$//g' /start
RUN chmod +x /start

COPY ./backend/ .

EXPOSE 9999

WORKDIR /app

ENTRYPOINT ["/entrypoint"]
