use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PostIt {
    pub id: String,
    pub title: String,
    pub content: String,
    pub priority: String,
    pub pos_x: f64,
    pub pos_y: f64,
    pub width: f64,
    pub height: f64,
    pub is_pinned: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Task {
    pub id: String,
    pub postit_id: String,
    pub text: String,
    pub is_checked: bool,
    pub sort_order: i32,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SubTask {
    pub id: String,
    pub task_id: String,
    pub text: String,
    pub is_checked: bool,
    pub sort_order: i32,
}
