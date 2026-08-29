import sys
import os

# Remove CWD from sys.path to prevent root 'app' folder shadowing 'backend/app'
cwd = os.getcwd()
sys.path = [p for p in sys.path if p != cwd and p != '']

# Add backend directory to sys.path
backend_path = os.path.join(cwd, 'backend')
sys.path.insert(0, backend_path)

# Run alembic
from alembic.config import main
if __name__ == '__main__':
    # Remove this script from argv
    sys.argv.pop(0)
    main()
