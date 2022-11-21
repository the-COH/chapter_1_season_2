terraform {
  backend "gcs" {
    bucket      = "ping-explorer-infra-bucket-tfstate"
    prefix      = "terraform/state"
    credentials = "../terraform-service-key.json"
  }
}

provider "google" {
  project     = var.project
  credentials = file(var.credentials)
  region      = var.region
  zone        = var.zone
}

resource "google_storage_bucket" "default" {
  name          = "ping-explorer-infra-bucket-tfstate"
  force_destroy = false
  location      = "US"
  storage_class = "STANDARD"
  versioning {
    enabled = true
  }
}

resource "google_project_service" "cloud_run_api" {
  service = "run.googleapis.com"
}

resource "google_cloud_run_service" "default" {
  name     = local.service_name
  location = var.region

  template {
    spec {
      containers {
        image = "gcr.io/${var.project}/${local.image_name}:${var.image_tag}"
        ports {
          container_port = 80
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }

  depends_on = [
    google_project_service.cloud_run_api
  ]
}

data "google_iam_policy" "noauth" {
  binding {
    role = "roles/run.invoker"
    members = [
      "allUsers",
    ]
  }
}

resource "google_cloud_run_service_iam_policy" "noauth" {
  location = google_cloud_run_service.default.location
  project  = google_cloud_run_service.default.project
  service  = google_cloud_run_service.default.name

  policy_data = data.google_iam_policy.noauth.policy_data
}
