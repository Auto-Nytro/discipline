// mod ui_text;

mod rules;

mod launcher;

mod serializaton;

mod vaults;
mod chronic;
mod other;
mod conditionals;
// pub mod rules;
// pub mod regulation;
// pub mod operating_system;
// pub mod users;
// pub mod daemon;
mod database;
pub mod x;
mod protocol;
// pub mod procedures;
// pub mod state;
// pub mod vs;

// #[tokio::main]
// async fn main() {
//   use crate::x::{Daemon, DaemonLaunchConfiguration};

//   println!("Hi from main");
//   let daemon = Daemon::open(DaemonLaunchConfiguration {
//     api_server_port: 9090,
//     database_directory: PathBuf::from("/workspaces/discipline/discipline_daemon_lib/data"),
//   }).await.unwrap();

//   daemon.start().await;
// }


mod procedures;