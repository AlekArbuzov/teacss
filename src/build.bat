CALL steal\js steal/pluginifyjs make.core.js -out ../lib/teacss.core.js -global
CALL steal\js steal/pluginifyjs make.full.js -out ../lib/teacss.full.js -global

:: ugly, but that's the way to keep css url paths safe
CALL steal\js steal/buildjs make.full.htm -to teacss/ui/style

CD ..
DEL src\teacss\ui\style\production.js
MOVE src\teacss\ui\style\production.css lib\teacss.full.css
ECHO d | XCOPY src\teacss\ui\style\images lib\images /S
CD src