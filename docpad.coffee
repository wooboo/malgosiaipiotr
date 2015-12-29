# DocPad Configuration File
# http://docpad.org/docs/config
# Requires
moment = require('moment')
moment.locale('pl')

setDates = (model)->
    model.setMetaDefaults({humanDate:moment(model.meta.attributes.date).format('LL'), computerDate:moment(model.meta.attributes.date).format('DD-MM-YYYY')})
# Define the DocPad Configuration
docpadConfig = {
	collections:
        pages: ->
            @getCollection("html").findAllLive({isPage:true})
        homeSections: ->
            @getCollection("html").findAllLive({relativeOutDirPath: 'sections', isPublished: true},[{order:1}])
        gifts: ->
            @getCollection("html").findAllLive({relativeOutDirPath: 'gifts', isPublished: true},[{order:1}])
        blogposts: ->
            @getCollection("html").findAllLive({relativeOutDirPath: 'posts'},[{date:1, author:2}]).on "add", setDates
    
    templateData:
        site:
            title: "My Website"
 
        getPreparedTitle: -> if @document.title then "#{@document.title} | #{@site.title}" else @site.title
        
        moment: moment
}


# Export the DocPad Configuration
module.exports = docpadConfig