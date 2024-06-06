---
layout: archive
title: "Publications"
permalink: /publications/
author_profile: true
---
 (* denotes equal contribution, # denotes corresponding authors)
 
{% if site.author.googlescholar %}
  <div class="wordwrap">You can also find my articles on <a href="{{site.author.googlescholar}}">my Google Scholar profile</a>.</div>
{% endif %}

{% include base_path %}
## *Jurnal*
{% assign journal_counter = 1 %}
{% for post in site.publications reversed %}
  {% if post.typology != "Conference" %}
    {% include archive-single.html counter=journal_counter %}
    {% assign journal_counter = journal_counter | plus: 1 %}
  {% endif %}
{% endfor %}
## *Conference*
{% assign conference_counter = 1 %}
{% for post in site.publications reversed %}
  {% if post.typology == "Conference" %}
    {% include archive-single.html counter=conference_counter %}
    {% assign conference_counter = conference_counter | plus: 1 %}
  {% endif %}
{% endfor %}

