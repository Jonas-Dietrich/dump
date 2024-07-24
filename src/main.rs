use std::{
    process::Command, time::Duration
};

use axum::{
    http::status, response::IntoResponse, routing::{get, post}, Json, Router
};
use serde_json::json;


#[tokio::main()]
async fn main() {
    println!("Hi, mom!");


    let app = Router::new()
        .route("/status", get(get_status))
        .route("/start", post(start_server))
        .route("/stop", post(stop_server));

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001").await.unwrap();

    axum::serve(listener, app).await.unwrap();

    println!("Goodbye, world!")
}

fn create_lockfile () {
    Command::new("touch")
        .arg("/home/jonas/locked.lock");
}

fn delete_lockfile () {
    Command::new("rm")
        .arg("/home/jonas/locked.lock");
}

fn exists_lockfile () -> bool {
    let res = Command::new("ls")
        .arg("/home/jonas")
        .output()
        .expect("oida des woa nix")
        .stdout;

    let skibidi = String::from_utf8(res).unwrap();

    return skibidi.contains("locked.lock")
}

async fn start_server() -> impl IntoResponse {

    if exists_lockfile() {
        return (
            [("Access-Control-Allow-Origin", "*")],
            Json(json!({"running" : false})),
        )
            .into_response();
    }
    
    create_lockfile();

    Command::new("screen")
        .args(["-S server", "-d", "-m", "/home/jonas/mc/starserter9.sh"]);

    Command::new("screen")
        .args(["-S server", "-X multiuser on"]);

    Command::new("screen")
        .args(["-S server", "-X acladd jonas"]);

    Command::new("screen")
        .args(["-S server", "-X acladd root"]);


    (
        [("Access-Control-Allow-Origin", "*")],
        Json(json!({"running" : true})),
    )
        .into_response()
}

async fn stop_server() -> impl IntoResponse {

    Command::new("screen").args(["-S server", "-X stuff \"stop$(printf \\\\\\r)\""]);
    tokio::time::sleep(Duration::from_secs(17)).await;

    Command::new("screen").args(["-S server", "-X stuff $'\\003'"]);

    delete_lockfile();

    (
        [("Access-Control-Allow-Origin", "*")],
        Json(json!({"running" : false})),
    )
        .into_response()
}

async fn get_status() -> impl IntoResponse {

    let is = exists_lockfile();
    (
        [("Access-Control-Allow-Origin", "*")],
        Json(json!({"running" : is})),
    )
        .into_response()
}

