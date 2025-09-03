import { supabase, type Database } from './supabase'

type Tables = Database['public']['Tables']
type Board = Tables['boards']['Row']
type BoardInsert = Tables['boards']['Insert']
type BoardUpdate = Tables['boards']['Update']
type User = Tables['users']['Row']

// User operations
export async function createUser(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({ email })
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating user:', error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('email', email)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

// Board operations
export async function createBoard(board: BoardInsert): Promise<Board | null> {
  try {
    const { data, error } = await supabase
      .from('boards')
      .insert(board)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating board:', error)
    return null
  }
}

export async function getBoardsByUserId(userId: string): Promise<Board[]> {
  try {
    const { data, error } = await supabase
      .from('boards')
      .select()
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching boards:', error)
    return []
  }
}

export async function getBoardById(id: string): Promise<Board | null> {
  try {
    const { data, error } = await supabase
      .from('boards')
      .select()
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching board:', error)
    return null
  }
}

export async function updateBoard(id: string, updates: BoardUpdate): Promise<Board | null> {
  try {
    const { data, error } = await supabase
      .from('boards')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating board:', error)
    return null
  }
}

export async function deleteBoard(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting board:', error)
    return false
  }
}

// Search boards by vibe/content
export async function searchBoards(userId: string, query: string): Promise<Board[]> {
  try {
    const { data, error } = await supabase
      .from('boards')
      .select()
      .eq('user_id', userId)
      .textSearch('vibe', query)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error searching boards:', error)
    return []
  }
}