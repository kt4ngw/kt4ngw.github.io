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
{% for post in site.publications reversed %}
  {% if post.typology != "Conference" %}
    {% include archive-single.html %}
  {% endif %}
{% endfor %}
## *Conference*
{% for post in site.publications reversed %}
  {% if post.typology == "Conference" %}
    {% include archive-single.html %}
  {% endif %}
{% endfor %}

