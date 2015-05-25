# DocPad Configuration File
# http://docpad.org/docs/config

# Define the DocPad Configuration
docpadConfig = {
	collections:
        pages: ->
            @getCollection("html").findAllLive({isPage:true})
        homeSections: ->
            @getCollection("html").findAllLive({relativeOutDirPath: 'sections'},[{order:1}])
	
    templateData:
        site:
            title: "My Website"

        getPreparedTitle: -> if @document.title then "#{@document.title} | #{@site.title}" else @site.title
}


# Export the DocPad Configuration
module.exports = docpadConfig