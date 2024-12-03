# cli.py

import argparse

def start_simulation():
    """Start the bike simulation."""
    print("Starting the simulation...")

def stop_simulation():
    """Start the bike simulation."""
    print("Stopping the simulation...")

def add_customer(city):
    """Add a customer to the simulation."""
    print(f"Adding customer in {city} to the simulation...")

def add_bike(city):
    """Add a bike to the simulation."""
    print(f"Adding bike in city to the simulation...")

def main():
    # Create the top-level parser
    parser = argparse.ArgumentParser(
        description="Simulation CLI"
    )

    # Define subcommands
    subparsers = parser.add_subparsers(dest="command", required=True, help="Subcommands")

    # Subcommand: start
    start_parser = subparsers.add_parser("start", help="Start the simulation")
    start_parser.set_defaults(func=start_simulation)

    # Subcommand: add-customer
    customer_parser = subparsers.add_parser("add-customer", help="Add a customer")
    customer_parser.set_defaults(func=lambda args: add_customer(args.city))

    # Subcommand: add-bike
    bike_parser = subparsers.add_parser("add-bike", help="Add a bike")
    bike_parser.add_argument("model", type=str, help="Model of the bike")
    bike_parser.add_argument("location", type=str, help="Location where the bike is placed")
    bike_parser.set_defaults(func=lambda args: add_bike(args.model, args.location))

    # Parse arguments and execute the appropriate function
    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
