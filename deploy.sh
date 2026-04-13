#!/bin/bash
echo "Deploying API Sentinel to Cloud Run..."
gcloud run deploy api-sentinel \
  --source . \
  --memory 512Mi \
  --allow-unauthenticated \
  --region us-central1
