#!/bin/bash

# Funcoes compartilhadas para scripts shell no Linux/WSL.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd_project_root() {
  cd "${PROJECT_ROOT}" || exit 1
}

require_command() {
  local cmd="$1"
  if ! command -v "${cmd}" >/dev/null 2>&1; then
    echo "❌ Comando obrigatório não encontrado: ${cmd}"
    exit 1
  fi
}

require_docker_running() {
  require_command docker
  if ! docker info >/dev/null 2>&1; then
    echo "❌ Docker não está em execução."
    echo "Inicie o Docker Desktop com integração WSL e tente novamente."
    exit 1
  fi
}

compose() {
  if docker compose version >/dev/null 2>&1; then
    docker compose "$@"
    return
  fi

  if command -v docker-compose >/dev/null 2>&1; then
    docker-compose "$@"
    return
  fi

  echo "❌ Docker Compose não encontrado (docker compose ou docker-compose)."
  exit 1
}

network_exists() {
  local network_name="$1"
  docker network ls --format '{{.Name}}' | grep -Fxq "${network_name}"
}

ensure_network() {
  local network_name="$1"
  local network_driver="${2:-bridge}"

  if network_exists "${network_name}"; then
    return 0
  fi

  docker network create --driver "${network_driver}" "${network_name}" >/dev/null
  echo "✅ Rede ${network_name} criada."
}
