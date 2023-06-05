
#!/bin/bash

error_exit()
{
    echo "$1" 1>&2
    exit 1
}

DEPLOY_STATUS="DEPLOYING"
PENDING_VERSION=0
while [ "$DEPLOY_STATUS" == "DEPLOYING" ]; do
    sleep 10
    echo "Checking deployment status..."
    BUILD=`aws lightsail get-container-services --service-name cookbooks`
    DEPLOY_STATUS=`echo $BUILD | jq '.containerServices[0].state' -r`
    PENDING_VERSION=`echo $BUILD | jq '.containerServices[0].nextDeployment.version' -r`
    if [ "$DEPLOY_STATUS" == "DEPLOYING" ]; then
        echo "Deployment is still in progress, waiting..."
    fi
done

DEPLOY_VERSION=`echo $BUILD | jq '.containerServices[0].currentDeployment.version' -r`
if [ "$DEPLOY_STATUS" != "RUNNING" && $DEPLOY_VERSION != $PENDING_VERSION ]; then
    error_exit "Deployment failed."
else
    echo "Deployment succeeded."
fi