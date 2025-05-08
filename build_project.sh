#!/bin/bash

# build_with_progress.sh

# Function to show spinner
show_spinner() {
    local pid=$1
    local delay=0.1
    local spinstr='|/-\'
    local counter=0
    local total_time=0
    
    printf "Building project "
    while [ "$(ps a | awk '{print $1}' | grep $pid)" ]; do
        local temp=${spinstr#?}
        printf "\r[%c] Time elapsed: %ds" "$spinstr" "$counter"
        local spinstr=$temp${spinstr%"$temp"}
        sleep $delay
        counter=$((counter + 1))
        total_time=$((counter / 10))  # Convert to seconds (assuming delay is 0.1)
    done
    printf "\r"
}

# Function to check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        echo "Error: npm is not installed"
        exit 1
    fi
}

# Function to execute build
execute_build() {
    echo "Starting build process..."
    echo "========================"
    
    # Create a log file
    BUILD_LOG="build.log"
    touch $BUILD_LOG
    
    # Run npm build and redirect output to log file
    npm run build > $BUILD_LOG 2>&1 &
    
    # Get the process ID
    BUILD_PID=$!
    
    # Show spinner while building
    show_spinner $BUILD_PID
    
    # Wait for build process to complete
    wait $BUILD_PID
    
    # Check if build was successful
    if [ $? -eq 0 ]; then
        echo -e "\n✅ Build completed successfully!"
        echo "========================"
        echo "Build output:"
        cat $BUILD_LOG
        rm $BUILD_LOG
        return 0
    else
        echo -e "\n❌ Build failed!"
        echo "========================"
        echo "Error log:"
        cat $BUILD_LOG
        rm $BUILD_LOG
        return 1
    fi
}

# Main execution
main() {
    # Check if npm is installed
    check_npm
    
    # Record start time
    START_TIME=$(date +%s)
    
    # Execute build
    execute_build
    BUILD_RESULT=$?
    
    # Record end time
    END_TIME=$(date +%s)
    
    # Calculate duration
    DURATION=$((END_TIME - START_TIME))
    
    echo -e "\nTotal build time: ${DURATION}s"
    
    # Exit with build result
    exit $BUILD_RESULT
}

# Run main function
main