"""Emit a small named-star subset from pinned HYG 4.1. Does not write files."""

import csv
import io
import json
import urllib.request

SOURCE = "https://raw.githubusercontent.com/astronexus/HYG-Database/c7f7f883fe678cc7680169a50ccd7dcc49b060ce/hyg/CURRENT/hygdata_v41.csv"


def main():
    with urllib.request.urlopen(SOURCE, timeout=30) as response:
        reader = csv.DictReader(io.TextIOWrapper(response, encoding="utf-8-sig"))
        stars = []
        for row in reader:
            if row["proper"] and row["hip"] and float(row["mag"]) <= 3:
                stars.append(
                    {
                        "id": row["id"],
                        "hip": row["hip"],
                        "name": row["proper"],
                        "ra": round(float(row["ra"]), 6),
                        "dec": round(float(row["dec"]), 6),
                        "mag": float(row["mag"]),
                        "constellation": row["con"],
                    }
                )
        stars.sort(key=lambda s: (s["mag"], s["name"]))
        print(json.dumps(stars, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
