#!/bin/bash
cd /home/kavia/workspace/code-generation/role-based-access-dashboard-113316-113325/react_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

