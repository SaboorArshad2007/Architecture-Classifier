"""
review_data.py
==============
Metadata inspection and label auditing utility for Pakistani Architecture Dataset.
Allows manual verification, re-labeling, building grouping assignment,
and inclusion/exclusion auditing prior to model training.
"""

import sys
import argparse
from pathlib import Path
import pandas as pd

from predict import CLASSES

METADATA_PATH = Path("data/metadata.csv")


def audit_summary():
    """Prints diagnostic distribution across classes, sites, and splits."""
    if not METADATA_PATH.exists():
        print(f"[ERROR] {METADATA_PATH} not found.")
        return

    df = pd.read_csv(METADATA_PATH)
    print("=" * 60)
    print("DATASET METADATA AUDIT REPORT")
    print("=" * 60)
    print(f"Total Catalogued Records: {len(df)}")
    print(f"Unique Heritage Sites:    {df['building'].nunique()}")
    print("\n[Era Distribution]:")
    print(df["class"].value_counts().to_string())

    if "split" in df.columns:
        print("\n[Split Distribution]:")
        print(df["split"].value_counts().to_string())

    print("\n[Top 8 Most Represented Monuments]:")
    print(df["building"].value_counts().head(8).to_string())
    print("=" * 60)


def relabel_record(image_filename: str, new_class: str, new_building: str = None):
    """Updates the class or building annotation for a specific image filename."""
    if not METADATA_PATH.exists():
        print(f"[ERROR] {METADATA_PATH} not found.")
        return

    df = pd.read_csv(METADATA_PATH)
    mask = df["image_path"].str.contains(image_filename, case=False, na=False)

    if not mask.any():
        print(f"[WARN] No records matched filename '{image_filename}'")
        return

    matched_indices = df[mask].index
    print(f"Found {len(matched_indices)} matching record(s).")

    for idx in matched_indices:
        old_class = df.at[idx, "class"]
        old_bld = df.at[idx, "building"]
        df.at[idx, "class"] = new_class
        if new_building:
            df.at[idx, "building"] = new_building
        print(f"Updated record [{idx}]: Class: {old_class} -> {new_class} | Building: {old_bld} -> {new_building or old_bld}")

    df.to_csv(METADATA_PATH, index=False)
    print(f"[SUCCESS] Saved changes to {METADATA_PATH}")


def exclude_record(image_filename: str):
    """Excludes an image (e.g., modern interior or mislabeled diagram) from the training pool."""
    if not METADATA_PATH.exists():
        print(f"[ERROR] {METADATA_PATH} not found.")
        return

    df = pd.read_csv(METADATA_PATH)
    mask = df["image_path"].str.contains(image_filename, case=False, na=False)

    if not mask.any():
        print(f"[WARN] No records matched filename '{image_filename}'")
        return

    df.loc[mask, "split"] = "excluded"
    df.to_csv(METADATA_PATH, index=False)
    print(f"[SUCCESS] Marked {mask.sum()} record(s) matching '{image_filename}' as 'excluded'.")


def main():
    parser = argparse.ArgumentParser(description="Audit and Edit Pakistani Architecture Dataset Metadata")
    parser.add_argument("--summary", action="store_true", help="Display summary stats of current metadata")
    parser.add_argument("--relabel", nargs=2, metavar=("FILENAME", "NEW_CLASS"), help="Change class of an image")
    parser.add_argument("--building", type=str, help="Optionally update building name during relabeling")
    parser.add_argument("--exclude", type=str, metavar="FILENAME", help="Exclude an image from training splits")
    args = parser.parse_args()

    if args.summary or (not args.relabel and not args.exclude):
        audit_summary()
    if args.relabel:
        filename, new_cls = args.relabel
        if new_cls not in CLASSES:
            print(f"[ERROR] Invalid class '{new_cls}'. Must be one of: {CLASSES}")
            return
        relabel_record(filename, new_cls, args.building)
    if args.exclude:
        exclude_record(args.exclude)


if __name__ == "__main__":
    main()
