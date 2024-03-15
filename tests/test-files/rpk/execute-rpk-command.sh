#!/bin/bash

# Execute the command passed as an argument
output=$(docker exec redpanda-0 $@)

# Check the output and return a custom exit code
if [[ $output =~ ^\s*Interact ]]; then
  echo "rpk returned help text indicating that the command was incorrect"
  echo $output
  exit 1 # If the first word is 'Interact', exit with code 1
else
  echo $output
  exit 0 # Otherwise, exit with code 0 indicating success
fi