
---

Here's simple `gtk3` calendar app for you to track the days.

```c
#include <stdlib.h>
#include <gtk/gtk.h>

int main (int argc, char *argv[])
{
    GtkWidget *window, *box, *calendar;
    gtk_init(&argc, &argv);

    window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
    gtk_window_set_title(GTK_WINDOW(window), "Calendar");

    box = gtk_box_new(FALSE, 0);
    gtk_container_add(GTK_CONTAINER(window), box);

    calendar = gtk_calendar_new();
    gtk_container_add(GTK_CONTAINER(box), calendar);

    g_signal_connect(G_OBJECT(window), "destroy", G_CALLBACK(gtk_main_quit), NULL);
    gtk_widget_show_all(window);
    gtk_main();

    return EXIT_SUCCESS;
}
```

Compile with (filename `main.c`):

```bash
gcc -Wall -Wextra -O2 -o calendar main.c `pkg-config --cflags --libs gtk+-3.0`
```

Happy new year and christmas in advance.