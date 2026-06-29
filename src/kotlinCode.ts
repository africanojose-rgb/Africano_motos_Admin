export const KOTLIN_CODE = {
  clientEntity: `package com.africanomotos.mototech.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "clients")
data class ClientEntity(
    @PrimaryKey
    val id: String, // e.g., "MT-8821"
    val name: String,
    val membership: String, // "Platinum", "Estándar", "VIP"
    val avatarUrl: String,
    val phone: String,
    val activeJob: String? = null
)`,

  clientDao: `package com.africanomotos.mototech.data.local.dao

import androidx.room.*
import com.africanomotos.mototech.data.local.entity.ClientEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface ClientDao {
    @Query("SELECT * FROM clients ORDER BY name ASC")
    fun getAllClients(): Flow<List<ClientEntity>>

    @Query("SELECT * FROM clients WHERE id = :clientId")
    suspend fun getClientById(clientId: String): ClientEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertClient(client: ClientEntity)

    @Update
    suspend fun updateClient(client: ClientEntity)

    @Delete
    suspend fun deleteClient(client: ClientEntity)

    @Query("SELECT COUNT(*) FROM clients")
    suspend fun getClientCount(): Int
}`,

  jobEntity: `package com.africanomotos.mototech.data.local.entity

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "jobs")
data class JobEntity(
    @PrimaryKey
    val id: String, // e.g., "JOB-8821"
    val clientId: String,
    val clientName: String,
    val bikeModel: String,
    val plate: String,
    val status: String, // "En Espera", "En Progreso", "Crítico", "Listo"
    val type: String,
    val estimatedDelivery: String,
    val laborPrice: Double,
    val partsPrice: Double,
    val progress: Int, // 0 to 100
    val date: String, // "YYYY-MM-DD"
    val isPaid: Boolean,
    val notes: String? = null
)`,

  jobDao: `package com.africanomotos.mototech.data.local.dao

import androidx.room.*
import com.africanomotos.mototech.data.local.entity.JobEntity
import kotlinx.coroutines.flow.Flow

@Dao
interface JobDao {
    @Query("SELECT * FROM jobs ORDER BY date DESC")
    fun getAllJobs(): Flow<List<JobEntity>>

    @Query("SELECT * FROM jobs WHERE status = :status")
    fun getJobsByStatus(status: String): Flow<List<JobEntity>>

    @Query("SELECT * FROM jobs WHERE clientId = :clientId")
    fun getJobsForClient(clientId: String): Flow<List<JobEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertJob(job: JobEntity)

    @Update
    suspend fun updateJob(job: JobEntity)

    @Query("UPDATE jobs SET progress = :progress, status = :status WHERE id = :jobId")
    suspend fun updateJobProgress(jobId: String, progress: Int, status: String)

    @Query("SELECT SUM(laborPrice) FROM jobs WHERE isPaid = 1")
    suspend fun getTotalLaborEarnings(): Double?

    @Query("SELECT SUM(partsPrice) FROM jobs WHERE isPaid = 1")
    suspend fun getTotalPartsEarnings(): Double?

    @Query("SELECT SUM(laborPrice + partsPrice) FROM jobs WHERE date BETWEEN :startDate AND :endDate")
    suspend fun getEarningsInRange(startDate: String, endDate: String): Double?
}`,

  appDatabase: `package com.africanomotos.mototech.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import com.africanomotos.mototech.data.local.dao.ClientDao
import com.africanomotos.mototech.data.local.dao.JobDao
import com.africanomotos.mototech.data.local.entity.ClientEntity
import com.africanomotos.mototech.data.local.entity.JobEntity

@Database(
    entities = [ClientEntity::class, JobEntity::class],
    version = 1,
    exportSchema = false
)
abstract class AppDatabase : RoomDatabase() {
    abstract fun clientDao(): ClientDao
    abstract fun jobDao(): JobDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "moto_tech_db"
                )
                .fallbackToDestructiveMigration()
                .build()
                INSTANCE = instance
                instance
            }
        }
    }
}`,

  mainActivity: `package com.africanomotos.mototech.ui

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.africanomotos.mototech.ui.theme.IndustrialMotoTheme
import com.africanomotos.mototech.ui.screens.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            IndustrialMotoTheme {
                var currentScreen by remember { mutableStateOf("dashboard") }
                
                Scaffold(
                    bottomBar = {
                        BottomNavBar(
                            currentScreen = currentScreen,
                            onScreenSelected = { currentScreen = it }
                        )
                    },
                    containerColor = Color(0xFF0B1326) // Deep Surface
                ) { innerPadding ->
                    Box(modifier = Modifier.padding(innerPadding)) {
                        when (currentScreen) {
                            "dashboard" -> DashboardScreen()
                            "jobs" -> JobsScreen()
                            "finances" -> FinancesScreen()
                            "clients" -> ClientsScreen()
                            "alerts" -> AlertsScreen()
                        }
                    }
                }
            }
        }
    }
}`
};
