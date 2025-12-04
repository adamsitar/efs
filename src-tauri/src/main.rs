// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    efs_lib::run();
    let tup = (500, 6.4, 1);
    let (x, y, z) = tup;
    println!("The value of y is: {x}, {y}, {z}");
    let a = [1, 2, 3, 4, 5];
}
