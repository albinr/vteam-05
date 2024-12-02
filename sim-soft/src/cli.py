# cli.py

import argparse

def start_simulation():
    """Start the scooter simulation."""
    print("Starting the simulation...")

def stop_simulation():
    """Start the scooter simulation."""
    print("Stopping the simulation...")

def add_customer(city):
    """Add a customer to the simulation."""
    print(f"Adding customer in {city} to the simulation...")

def add_scooter(city):
    """Add a scooter to the simulation."""
    print(f"Adding scooter in city to the simulation...")

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
    customer_parser.set_defaults(func=lambda args: add_customer(args.name, args.city))

    # Subcommand: add-scooter
    scooter_parser = subparsers.add_parser("add-scooter", help="Add a scooter")
    scooter_parser.add_argument("model", type=str, help="Model of the scooter")
    scooter_parser.add_argument("location", type=str, help="Location where the scooter is placed")
    scooter_parser.set_defaults(func=lambda args: add_scooter(args.model, args.location))

    # Parse arguments and execute the appropriate function
    args = parser.parse_args()
    args.func(args)

if __name__ == "__main__":
    main()
