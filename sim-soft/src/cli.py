# cli.py

import argparse
from simulation import Simulation

def main():
    parser = argparse.ArgumentParser(description="Simulation CLI")

    subparsers = parser.add_subparsers(dest="command", required=True)

    # Start command
    start_parser = subparsers.add_parser("start", help="Start the simulation")
    start_parser.add_argument("--num-bikes", type=int, required=True, help="Number of bikes to simulate")
    # start_parser.add_argument("--num-users", type=int, required=True, help="Number of users to simulate")
    start_parser.add_argument("--log-level", type=str, default="info", help="Logging level (default: info)")

    # Stop command
    subparsers.add_parser("stop", help="Stop the simulation")

    # Parse arguments
    args = parser.parse_args()

    # Handle commands
    if args.command == "start":
        simulation = Simulation(num_bikes=args.num_bikes)
        simulation.start()
    elif args.command == "stop":
        print("Stopping simulation... (not implemented)")


if __name__ == "__main__":
    main()
