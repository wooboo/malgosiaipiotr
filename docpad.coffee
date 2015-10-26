# DocPad Configuration File
# http://docpad.org/docs/config
# Requires
moment = require('moment')
moment.locale('pl')

setDates = (model)->
    model.setMetaDefaults({humanDate:moment(this.date).format('LL'), computerDate:moment(this.date).format('DD-MM-YYYY')})
# Define the DocPad Configuration
docpadConfig = {
	collections:
        pages: ->
            @getCollection("html").findAllLive({isPage:true})
        homeSections: ->
            @getCollection("html").findAllLive({relativeOutDirPath: 'sections', isPublished: true},[{order:1}])
        blogposts: ->
            @getCollection("html").findAllLive({relativeOutDirPath: 'posts'},[{date:1}]).on "add", setDates
    
    templateData:
        site:
            title: "My Website"
 
        getPreparedTitle: -> if @document.title then "#{@document.title} | #{@site.title}" else @site.title

}


# Export the DocPad Configuration
module.exports = docpadConfig