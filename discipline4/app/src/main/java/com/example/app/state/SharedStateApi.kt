package com.example.app

import com.example.app.*
import com.example.app.database.*
import android.database.Cursor
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

public class SharedStateApi(
  val state: State,
  val database: DatabaseConnection,
  val mutex: Mutex,
) {
}
