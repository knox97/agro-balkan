var currentCategory = "{{category}}";
console.log(currentCategory);

function showAddPost() {
	$('.newPostWindow')css('visibility', 'visible');
	
}

function addPost() {
	var url = `http://localhost:3000/api/addPost?name={{user.name}}&phone=0644070112&price=35&desc=Hellothere&title=Test35&category=${currentCategory}`;

	$.ajax({
		type: 'GET',
		url: url,
		dataType: 'json',
		success: function(data) {
			console.log(data);
		},
		error: function(err) {
			console.log(err);
		}
	});
}
var obj = '{{user.name}}';

console.log(url);
console.log(obj);