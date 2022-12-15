#!/bin/bash
BLUE='\033[0;34m'
BBLUE='\033[1;34m' #BOLD
PURPLE='\033[0;35m'
BPURPLE='\033[1;35m' #BOLD
RED='\033[0;31m'
BRED='\033[1;31m' #BOLD
GREEN='\033[0;32m'
BGREEN='\033[1;32m' #BOLD
GRAY='\033[1;30m'
NC='\033[0m' # No Color
PxBlueModule=node_modules/@brightlayer-ui/PxBlueModule
OurUIModule=PxGreenUIModule
core=green-core

echo -e
# exit when any command fails
set -e

if [ "$2" == "blueLayoutsOnly" ]; then
    echo -e "blueLayoutsOnly -> skipOurs,skipNonBlueLayouts"
    skipOurs=true
    skipNonBlueLayouts=true
elif [ "$2" == "blueOnly" ]; then
    echo -e "blueOnly -> skipOurs"
    skipOurs=true
elif [ "$2" == "oursOnly" ]; then
    echo -e "blueOnly -> skipBlue,skipNonBlueLayouts"
    skipBlue=true
    skipNonBlueLayouts=true
fi

# Install Dependencies
#if [ -z "$1" ]; then
#if [[ -z "$1" && "$1" != 1 ]]; then
if [ $1 != 1 ]; then
    echo -e "${BBLUE}########################################${NC}"
    echo -e "${BBLUE}####### INSTALLING DEPENDENCIES ########${NC}"
    echo -e "${BBLUE}########################################${NC}"
    echo -e
    echo -e "${BLUE}Utilities...${NC}"
    cd ${PxBlueModule}/utilities && npm install --legacy-peer-deps && cd ../../../..
    echo -e
    echo -e "${BLUE}Layouts...${NC}"
    cd ${PxBlueModule}/layouts && npm install --legacy-peer-deps && cd ../../../..
    echo -e
    echo -e "${BLUE}Seed Router...${NC}"
    cd ${PxBlueModule}/seed-router && npm install --legacy-peer-deps && cd ../../../..
    echo -e
    echo -e "${BLUE}Core...${NC}"
    cd ${OurUIModule} && npm install --legacy-peer-deps && cd ..
    echo -e
    echo -e "${BLUE}APP...${NC}"
    npm install --legacy-peer-deps
    echo -e
    echo -e "${BGREEN}DONE${NC}"
    echo -e
fi

# Configuration Files Copy from Source To Destination Folder
if [ $1 != 1 ]; then
    #srcpath="../../../../Workspace/edge-rtos-babelfish-v3/examples/services/civetweb_http_webserver/configuration"
    dstpath="./node_modules/@brightlayer-ui/"
    if [ ! -d "$1" ]; then
        echo "Source path: $1 doesn't exist"
        exit 1
    fi
    mkdir -p "$dstpath"
        echo -e "${BBLUE}########################################${NC}"
        echo -e "${BBLUE}##### COPYING CONFIGURATION FILES ######${NC}"
        echo -e "${BBLUE}########################################${NC}"
    cp -r "$1" "$dstpath"
        echo -e
        echo -e "${BGREEN}DONE${NC}"
        echo -e
fi

# Build Modules
echo -e "${BBLUE}########################################${NC}"
echo -e "${BBLUE}########### BUILDING MODULES ###########${NC}"
echo -e "${BBLUE}########################################${NC}"
echo -e
if [ -z $skipBlue ]; then
    if [ -z $skipNonBlueLayouts ]; then
        echo -e "${BLUE}Utilities...${NC}"
        cd ${PxBlueModule}/utilities && npm run-script build && cd ../../../..
        echo -e
    fi

    echo -e "${BLUE}Layouts...${NC}"
    cd ${PxBlueModule}/layouts && npm run-script build && cd ../../../..
    echo -e

    if [ -z $skipNonBlueLayouts ]; then
        echo -e "${BLUE}Seed Router...${NC}"
        cd ${PxBlueModule}/seed-router && npm run-script build && cd ../../../..
        echo -e
    fi
fi
if [ -z $skipOurs ]; then
    echo -e
    echo -e "${BLUE}Core...${NC}"
    cd ${OurUIModule} && npm run-script build && cd ..
    echo -e
    echo -e "${BGREEN}DONE${NC}"
    echo -e
fi

# Remove old links
echo -e "${BBLUE}########################################${NC}"
echo -e "${BBLUE}######### REMOVING OLD LINKS ###########${NC}"
echo -e "${BBLUE}########################################${NC}"
echo -e

rm -rf node_modules/.cache

if [ -z $skipOurs ]; then
    rm -rf node_modules/@brightlayer-ui/${core}
fi
if [ -z $skipBlue ]; then
    if [ -z $skipNonBlueLayouts ]; then
        rm -rf node_modules/@brightlayer-ui/seed-router
    fi

    rm -rf node_modules/@brightlayer-ui/layouts

    if [ -z $skipNonBlueLayouts ]; then
        rm -rf node_modules/@brightlayer-ui/utilities
    fi

    echo -e "${BGREEN}DONE${NC}"
    echo -e
    echo -e
fi

# Create new folders
echo -e "${BBLUE}########################################${NC}"
echo -e "${BBLUE}######### CREATING NEW FOLDERS #########${NC}"
echo -e "${BBLUE}########################################${NC}"
echo -e

mkdir -p "node_modules/@brightlayer-ui/"${core}
mkdir -p "node_modules/@brightlayer-ui/seed-router"
mkdir -p "node_modules/@brightlayer-ui/layouts"
mkdir -p "node_modules/@brightlayer-ui/utilities"
echo -e "${BGREEN}DONE${NC}"
echo -e
echo -e

# Link the modules into node_modules
echo -e "${BBLUE}########################################${NC}"
echo -e "${BBLUE}########### LINKING MODULES ############${NC}"
echo -e "${BBLUE}########################################${NC}"
echo -e

if [ -z $skipBlue ]; then
    if [ -z $skipNonBlueLayouts ]; then
        echo -en "${BLUE}Utilities...${NC}"
        cp -r ${PxBlueModule}/utilities/package.json node_modules/@brightlayer-ui/utilities/package.json
        cp -r ${PxBlueModule}/utilities/dist node_modules/@brightlayer-ui/utilities/
        echo -e "${GREEN}Linked${NC}"
        echo -e
    fi

    echo -en "${BLUE}Layouts...${NC}"
    cp -r ${PxBlueModule}/layouts/package.json node_modules/@brightlayer-ui/layouts/package.json
    cp -r ${PxBlueModule}/layouts/dist node_modules/@brightlayer-ui/layouts/
    echo -e "${GREEN}Linked${NC}"
    echo -e

    if [ -z $skipNonBlueLayouts ]; then
        echo -en "${BLUE}Seed Router...${NC}"
        cp -r ${PxBlueModule}/seed-router/package.json node_modules/@brightlayer-ui/seed-router/package.json
        cp -r ${PxBlueModule}/seed-router/dist node_modules/@brightlayer-ui/seed-router/
        echo -e "${GREEN}Linked${NC}"
        echo -e
    fi
fi
if [ -z $skipOurs ]; then
    echo -en "${BLUE}Core...${NC}"
    cp -r ${OurUIModule}/package.json node_modules/@brightlayer-ui/${core}/package.json
    cp -r ${OurUIModule}/src/assets ${OurUIModule}/dist/
    cp -r ${OurUIModule}/dist node_modules/@brightlayer-ui/${core}/
    echo -e "${GREEN}Linked${NC}"
    echo -e
    echo -e
fi

# Verify that the linking is complete
echo -e "${BBLUE}########################################${NC}"
echo -e "${BBLUE}########### VERIFYING LINKS ############${NC}"
echo -e "${BBLUE}########################################${NC}"
echo -e

if [ -z $skipBlue ]; then
    if [ -z $skipNonBlueLayouts ]; then
        echo -en "${BLUE}Utilities...${NC}"
        if [ ! -f node_modules/@brightlayer-ui/utilities/package.json ]; then echo -e "${BRED}Not Linked${NC}" && exit 1; fi
        if [ ! -s node_modules/@brightlayer-ui/utilities/dist ]; 
            then 
                if [ ! -f node_modules/@brightlayer-ui/utilities/dist/index.js ];
                    then echo -e "${BRED}Not Linked${NC}" && exit 1; 
                fi
        fi
        echo -e "${GREEN}Verified${NC}"
        echo -e
    fi

    echo -en "${BLUE}Layouts...${NC}"
    if [ ! -f node_modules/@brightlayer-ui/layouts/package.json ]; then echo -e "${BRED}Not Linked${NC}" && exit 1; fi
    if [ ! -s node_modules/@brightlayer-ui/layouts/dist ]; 
        then 
            if [ ! -f node_modules/@brightlayer-ui/layouts/dist/index.js ];
                then echo -e "${BRED}Not Linked${NC}" && exit 1; 
            fi
    fi
    echo -e "${GREEN}Verified${NC}"
    echo -e

    if [ -z $skipNonBlueLayouts ]; then
        echo -en "${BLUE}Seed Router...${NC}"
        if [ ! -f node_modules/@brightlayer-ui/seed-router/package.json ]; then echo -e "${BRED}Not Linked${NC}" && exit 1; fi
        if [ ! -s node_modules/@brightlayer-ui/seed-router/dist ]; 
            then 
                if [ ! -f node_modules/@brightlayer-ui/seed-router/dist/index.js ];
                    then echo -e "${BRED}Not Linked${NC}" && exit 1; 
                fi
        fi
        echo -e "${GREEN}Verified${NC}"
        echo -e
    fi
fi

if [ -z $skipOurs ]; then
    echo -en "${BLUE}Core...${NC}"
    if [ ! -f node_modules/@brightlayer-ui/${core}/package.json ]; then echo -e "${BRED}Not Linked${NC}" && exit 1; fi
    if [ ! -s node_modules/@brightlayer-ui/${core}/dist ]; 
        then 
            if [ ! -f node_modules/@brightlayer-ui/${core}/dist/index.js ];
                then echo -e "${BRED}Not Linked${NC}" && exit 1; 
            fi
    fi
    echo -e "${GREEN}Verified${NC}"
    echo -e
    echo -e
fi

echo -e "${BGREEN}########################################${NC}"
echo -e "${BGREEN}####### LINKING MODULES COMPLETE #######${NC}"
echo -e "${BGREEN}########################################${NC}"
echo -e
exit 0