"""
cli.py

Command line interface to start the simulation
"""

import argparse
import asyncio
from simulation import Simulation

async def main():
    """
    Main function to start the simulation
    """
    parser = argparse.ArgumentParser(description="Simulation CLI")

    subparsers = parser.add_subparsers(dest="command", required=True)

    # Start command
    start_parser = subparsers.add_parser("start", help="Start the simulation")

    start_parser.add_argument("--num-bikes",
    type=int, required=True, help="Number of bikes to simulate")

    # start_parser.add_argument("--num-users",
    # type=int, required=True, help="Number of users to simulate")

    start_parser.add_argument("--log-level",
    type=str, default="info", help="Logging level (default: info)")

    # Stop command
    subparsers.add_parser("stop", help="Stop the simulation")

    # Parse arguments
    args = parser.parse_args()

    # Handle commands
    if args.command == "start":
        simulation = Simulation(num_bikes=args.num_bikes)
        simulation_task = asyncio.create_task(simulation.start())

        # Update bike 2's battery level
        # await simulation.update_bike_data(bike_id=1, battery=50)

        # Ensure thath the simulation completes
        await simulation_task
    elif args.command == "stop":
        print("Stopping simulation... (not implemented)")


if __name__ == "__main__":
    asyncio.run(main())
