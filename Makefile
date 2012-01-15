BUILD_DIR = build
RELEASE_DIR = release

RESOURCES = ${BUILD_DIR}/header.js\
			dev/utils.js\
			dev/abstract-fullscreen.js\
			dev/native-fullscreen.js\
			dev/fallback-fullscreen.js\
			dev/jquery-fullscreen.js\
			${BUILD_DIR}/footer.js

LIB_VER = $(shell cat ${BUILD_DIR}/version.txt)
VER = sed "s/@VERSION/${LIB_VER}/"
DATE = $(shell date)

COMBINED = ${RELEASE_DIR}/jquery.fullscreen-${LIB_VER}.js
MINIFIED = ${RELEASE_DIR}/jquery.fullscreen-${LIB_VER}.min.js

combine: $(RESOURCES)
	rm -rf ${RELEASE_DIR}
	mkdir ${RELEASE_DIR}
	cat $(RESOURCES) | \
		sed 's/@DATE/'"${DATE}"'/' | \
		${VER} > $(COMBINED)

min: combine
	uglifyjs $(COMBINED) > $(MINIFIED)