from typing import Dict, List, Set

from fastapi import HTTPException, status


# The directed adjacency map for booking states
TRANSITIONS: Dict[str, List[str]] = {
    "REQUESTED": ["ACCEPTED", "CANCELLED"],
    "ACCEPTED": ["WORKER_ON_THE_WAY", "CANCELLED"],
    "WORKER_ON_THE_WAY": ["ARRIVED", "CANCELLED"],
    "ARRIVED": ["IN_PROGRESS", "CANCELLED"],
    "IN_PROGRESS": ["COMPLETED", "DISPUTED"],
    "COMPLETED": ["PAYMENT_PENDING"],
    "PAYMENT_PENDING": ["PAID", "DISPUTED"],
    "PAID": ["RATED"],
    "CANCELLED": [],
    "DISPUTED": [],
    "RATED": [],
}

# Sets controlling who can trigger which transitions
CUSTOMER_TRANSITIONS: Set[str] = {
    "REQUESTED->CANCELLED",
    "ACCEPTED->CANCELLED",
    "WORKER_ON_THE_WAY->CANCELLED",
    "ARRIVED->CANCELLED",
    "PAYMENT_PENDING->PAID",
    "PAYMENT_PENDING->DISPUTED",
    "PAID->RATED",
}

WORKER_TRANSITIONS: Set[str] = {
    "REQUESTED->ACCEPTED",
    "ACCEPTED->WORKER_ON_THE_WAY",
    "WORKER_ON_THE_WAY->ARRIVED",
    "ARRIVED->IN_PROGRESS",
    "IN_PROGRESS->COMPLETED",
    "IN_PROGRESS->DISPUTED",
    "ACCEPTED->CANCELLED",
    "WORKER_ON_THE_WAY->CANCELLED",
    "ARRIVED->CANCELLED",
}

ADMIN_TRANSITIONS: Set[str] = {
    "DISPUTED->COMPLETED",
    "DISPUTED->PAYMENT_PENDING",
    "DISPUTED->CANCELLED",
}


def validate_transition(from_status: str, to_status: str, role: str) -> None:
    """
    Validates if a transition is structurally legal and if the given role is authorized.
    Raises HTTPException (409 Conflict or 403 Forbidden) on failure.
    """
    # 1. Check if structural transition is valid
    if to_status not in TRANSITIONS.get(from_status, []):
        if role == "admin" and from_status == "DISPUTED":
            # Admin can transition from DISPUTED out of normal flow
            pass
        else:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Illegal transition from {from_status} to {to_status}",
            )

    # 2. Check Role authorization
    transition_key = f"{from_status}->{to_status}"
    
    if role == "customer":
        if transition_key not in CUSTOMER_TRANSITIONS:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Customers cannot transition from {from_status} to {to_status}",
            )
    elif role == "worker":
        if transition_key not in WORKER_TRANSITIONS:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Workers cannot transition from {from_status} to {to_status}",
            )
    elif role == "admin":
        if transition_key not in ADMIN_TRANSITIONS and to_status not in TRANSITIONS.get(from_status, []):
            # Admin can do generic forced transitions if needed, but restrict specific ones here if desired
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Admins cannot transition from {from_status} to {to_status}",
            )
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Invalid role",
        )
