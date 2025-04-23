# How to Add a New Feature: Extract Data from Backend API and Display in Frontend

This guide explains the process of exposing data from your Django backend via an API endpoint and displaying it in your frontend (HTML/JS or React).

---

## 1. Add a View in Django

- In `api/views.py`, define a new function using the `@api_view` decorator.
- Use Django's database connection to fetch data.
- Return the data as a JSON response using `Response`.

**Example:**
```python
@api_view(['GET'])
def get_new_table(request):
    with connection.cursor() as cursor:
        cursor.execute("SELECT name FROM student")
        columns = [col[0] for col in cursor.description]
        data = [dict(zip(columns, row)) for row in cursor.fetchall()]
    return Response({'data': data})
```

---

## 2. Register the Endpoint in URLs

- In `api/urls.py`, import your view and add a path for it.

**Example:**
```python
from . import views

urlpatterns = [
    # ...existing urls...
    path('new-table/', views.get_new_table),
]
```

---

## 3. Fetch Data from the Frontend

- Use JavaScript's `fetch` API to call your endpoint.
- Process and display the data in the DOM.

**Example:**
```js
fetch("http://localhost:8000/api/new-table/")
  .then(response => response.json())
  .then(data => {
    // Display the raw JSON
    document.getElementById("backend-message").textContent = JSON.stringify(data);

    // Display only the student names if data exists
    const tableDiv = document.getElementById("new-table-data");
    tableDiv.innerHTML = "";
    if (data.data && data.data.length > 0) {
      let html = "<ul>";
      data.data.forEach(row => {
        html += `<li>${row.name}</li>`;
      });
      html += "</ul>";
      tableDiv.innerHTML = html;
    } else {
      tableDiv.textContent = "No student names found.";
    }
  })
  .catch(error => {
    document.getElementById("backend-message").textContent = "Error fetching data from backend.";
  });
```

---

## 4. Add UI Elements

- In your HTML, add elements to trigger the fetch and display the results.

**Example:**
```html
<button id="fetch-backend-btn">Fetch Backend Message</button>
<div id="backend-message"></div>
<div id="new-table-data"></div>
```

---

## 5. Test

- Start your Django backend (`python manage.py runserver`).
- Open your frontend in the browser.
- Click the button to fetch and display data.

---

**Tip:**  
You can repeat this process for any table or query by changing the SQL and endpoint name.
