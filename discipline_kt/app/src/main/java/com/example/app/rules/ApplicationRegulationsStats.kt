package com.example.app

public data class ApplicationRegulationsStats(
  var applicationRegulationsNumber: Int,
  var maximumApplicationRegulationsNumber: Int,
) {
  fun isFull(): Boolean {
    return applicationRegulationsNumber >= maximumApplicationRegulationsNumber
  }
}