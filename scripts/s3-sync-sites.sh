#!/usr/bin/env bash

set -euo pipefail

readonly OUTPUTS_FILE="${1:-cdk-outputs.json}"
readonly AWS_REGION="${AWS_REGION:-us-east-1}"
readonly STRICT_MODE="${STRICT_MODE:-true}"
readonly DEFAULT_SITE_KEYS=(
  "2ad"
  "kellycairns"
  "archiecairns"
  "emmycairns"
  "minacairns"
)

if [[ -n "${SYNC_SITES:-}" ]]; then
  IFS=',' read -r -a SITE_KEYS <<<"${SYNC_SITES}"
else
  SITE_KEYS=("${DEFAULT_SITE_KEYS[@]}")
fi

site_stack_name() {
  case "$1" in
    "2ad")
      echo "Stack2adCom"
      ;;
    "kellycairns")
      echo "StackKellyCairnsCom"
      ;;
    "archiecairns")
      echo "StackArchieCairnsCom"
      ;;
    "emmycairns")
      echo "StackEmmyCairnsCom"
      ;;
    "minacairns")
      echo "StackMinaCairnsCom"
      ;;
    *)
      echo "Unsupported site key: $1" >&2
      exit 1
      ;;
  esac
}

site_output_directory() {
  case "$1" in
    "2ad")
      echo "./2ad/output"
      ;;
    "kellycairns")
      echo "./kellycairns/output"
      ;;
    "archiecairns")
      echo "./archiecairns/output"
      ;;
    "emmycairns")
      echo "./emmycairns/output"
      ;;
    "minacairns")
      echo "./minacairns/output"
      ;;
    *)
      echo "Unsupported site key: $1" >&2
      exit 1
      ;;
  esac
}

for site in "${SITE_KEYS[@]}"; do
  stack_name="$(site_stack_name "${site}")"
  bucket_name="$(jq -r --arg stack "${stack_name}" '.[$stack].SiteBucketName' "${OUTPUTS_FILE}")"
  distribution_id="$(jq -r --arg stack "${stack_name}" '.[$stack].DistributionId' "${OUTPUTS_FILE}")"
  output_dir="$(site_output_directory "${site}")"

  if [[ "${bucket_name}" == "null" || -z "${bucket_name}" ]]; then
    if [[ "${STRICT_MODE}" == "true" ]]; then
      echo "Missing SiteBucketName output for ${stack_name}" >&2
      exit 1
    fi
    echo "Skipping ${site}; stack output ${stack_name} not present in ${OUTPUTS_FILE}"
    continue
  fi

  if [[ "${distribution_id}" == "null" || -z "${distribution_id}" ]]; then
    if [[ "${STRICT_MODE}" == "true" ]]; then
      echo "Missing DistributionId output for ${stack_name}" >&2
      exit 1
    fi
    echo "Skipping ${site}; distribution output missing for ${stack_name}"
    continue
  fi

  if [[ ! -d "${output_dir}" ]]; then
    echo "Output directory not found for ${site}: ${output_dir}" >&2
    exit 1
  fi

  aws s3 sync "${output_dir}" "s3://${bucket_name}" --delete --region "${AWS_REGION}"
  aws cloudfront create-invalidation --distribution-id "${distribution_id}" --paths "/*" >/dev/null
done
