RESOURCES = build/header.js\
			dev/utils.js\
			dev/abstract-fullscreen.js\
			dev/native-fullscreen.js\
			dev/fallback-fullscreen.js\
			dev/jquery-fullscreen.js\
			build/footer.js

LIB_VER = $(shell cat build/version.txt)
VER = sed "s/@VERSION/${LIB_VER}/"
DATE = $(shell date)

COMBINED = release/jquery.fullscreen-${LIB_VER}.js
MINIFIED = release/jquery.fullscreen-${LIB_VER}.min.js

$(COMBINED): $(RESOURCES)
	cat $(RESOURCES) | \
		sed 's/@DATE/'"${DATE}"'/' | \
		${VER} > $(COMBINED)

min: $(COMBINED)
	uglifyjs $(COMBINED) > $(MINIFIED)