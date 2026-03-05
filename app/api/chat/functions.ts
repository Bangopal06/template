import { supabaseAdmin } from '@/lib/supabase'

// Function definitions for AI
export const functions = [
  {
    name: 'get_user_statistics',
    description: 'Mendapatkan statistik pengguna dari database termasuk jumlah total user, user aktif, admin, dll',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_user_list',
    description: 'Mendapatkan daftar pengguna dengan detail lengkap',
    parameters: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: 'Jumlah maksimal user yang ditampilkan (default: 10)',
        },
      },
    },
  },
]

// Function implementations
export async function executeFunction(functionName: string, args: any) {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not configured')
  }

  switch (functionName) {
    case 'get_user_statistics':
      return await getUserStatistics()
    
    case 'get_user_list':
      return await getUserList(args.limit || 10)
    
    default:
      throw new Error(`Unknown function: ${functionName}`)
  }
}

async function getUserStatistics() {
  try {
    // Get total users
    const { count: totalUsers } = await supabaseAdmin!
      .from('users')
      .select('*', { count: 'exact', head: true })

    // Get users by role
    const { data: users } = await supabaseAdmin!
      .from('users')
      .select('role, createdAt')

    const adminCount = users?.filter(u => u.role === 'ADMIN').length || 0
    const userCount = users?.filter(u => u.role === 'USER').length || 0

    // Get users created in last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentUsers = users?.filter(u => new Date(u.createdAt) > thirtyDaysAgo).length || 0

    return {
      success: true,
      data: {
        totalUsers: totalUsers || 0,
        adminCount,
        userCount,
        recentUsers,
        message: `Total pengguna: ${totalUsers}, Admin: ${adminCount}, User biasa: ${userCount}, Pengguna baru (30 hari terakhir): ${recentUsers}`,
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}

async function getUserList(limit: number) {
  try {
    const { data: users, error } = await supabaseAdmin!
      .from('users')
      .select('id, email, role, createdAt')
      .order('createdAt', { ascending: false })
      .limit(limit)

    if (error) throw error

    return {
      success: true,
      data: {
        users,
        count: users?.length || 0,
        message: `Ditemukan ${users?.length || 0} pengguna`,
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    }
  }
}
