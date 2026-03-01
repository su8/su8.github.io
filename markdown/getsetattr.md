
---

| The `setattr()` function in Python allows you to dynamically set or update an attribute of an object at runtime using the attribute's name as a string. This is especially useful when attribute names are determined programmatically. `getattr()` dynamically retrieves an attribute (or method) from an object by name.

```python
attrs_list = ['encoding', 'section', 'langs', 'damn_you_bro',
        'was_douchebag', 'pitty_to_see_it_go', 'how_dare_you', 'cheers',
        'eyecandy', 'i_like_it_too', 'good_choice', 'thats_my_boy',
        'program_description', 'dev_website', 'license', 'suggestions',
        'comments', 'program_name', 'not_here', 'install_it', 'remove_it',
        'installed', 'development', 'graphics', 'internet', 'click_to',
        'multimedia', 'system, utilities', 'about', 'was', 'it',
        'successfully', 'installed2', 'not_here2', 'iz']
for x in attrs_list:
  setattr(action, x, str())

# getattr
            #exe_file or path, Img.program_name, Menu.program_name, program_name.capitalize()
self.deep_copy[key] = (value[0], getattr(Img, '{}_img'.format(key2)), getattr(arg[0], skyp_or_not), value[1]) getattr(arg[0], '{}_icon_tooltip'.format(key2)).set_tooltip_text((value[2] if not len(value) > 3 else value[3]))        # faenza icon tooltip text
if not getattr(arg[2], 'first_run'):
  for key, value in local_dict.items():
    key2 = (key if not len(value) > 3 else value[2])
      skyp_or_not = (key2 if not key2 == 'skype' else 'skyp')
        getattr(arg[0], skyp_or_not).connect('clicked', StartKickingSomeNinjas, key)
        setattr(arg[2], 'first_run', 'not first run')
```
