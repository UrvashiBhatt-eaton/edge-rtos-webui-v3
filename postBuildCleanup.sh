#!/bin/bash
OurUIModule=PxGreenUIModule

# Revert pb.js file to last commit
echo -e
cd ${OurUIModule} && git checkout HEAD ./src/communication/pb.js && cd ..
echo -e

exit 0