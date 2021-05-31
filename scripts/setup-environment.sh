#!/usr/bin/env bash

APPID_NAME="$1"

if [[ -z "${APPID_NAME}" ]]; then
  echo "The APPID_NAME is required as the first argument"
  exit 1
fi

APPID_ID=$(ibmcloud resource service-instance "${APPID_NAME}" --output JSON | jq -r '.[] | .id')

export APPID_CONFIG=$(ibmcloud resource service-keys --output JSON | jq -c --arg ID "${APPID_ID}" '[.[] | select(.source_crn == $ID)][0].credentials')
export APP_URI="http://localhost:3000"
