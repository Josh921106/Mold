#!/bin/sh

python -m models

exec flask run --host=0.0.0.0 --port=3000
