#!/usr/bin/env bash
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate

Set-Content -Encoding ascii .gitattributes "*.sh text eol=lf"
git add .gitattributes build.sh backend/build.sh
git add --renormalize backend/build.sh