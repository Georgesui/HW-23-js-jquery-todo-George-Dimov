let todos = [];

$(function () {
	let $list = $('.list')
	let $ourInput = $('.input')
	$.ajax({
		type: 'GET',
		url: 'http://localhost:3000/todos',
		success: function (posts) {
			todos.push(posts);
			let $lis = ''
			$.each(posts, function (i, post) {
				let $taskStatus = post.complited ? 'status-done' : 'set-in-process';
				$lis += `<li id="${post.id}" data-id="${post.id}" class="${$taskStatus}">${post.task}<button class="set-status" data-action="set-status">Change status</button><button class="delete-task" data-action="delete-task">Delete</button><button class="move-up" data-action="move-up">Move Up</button><button class="move-down" data-action="move-down">Move Down</button></li>`
			})
			$list.html($lis)
		},
		error: function () {
			console.warn('Error')
		}
	})

	$('.create').on('click', function () {
		let requestToAddNewField = {
			task: $ourInput.val(),
			complited: false
		}
		$.ajax({
			type: 'POST',
			url: 'http://localhost:3000/todos',
			data: requestToAddNewField,
			success: function (requestToAddNewField) {
				$list.append(`<li id="${requestToAddNewField.id}" data-id="${requestToAddNewField.id}" class="${'set-in-process'}">${requestToAddNewField.task}<button class="set-status" data-action="set-status">Change status</button><button class="delete-task" data-action="delete-task">Delete</button><button class="move-up" data-action="move-up">Move Up</button><button class="move-down" data-action="move-down">Move Down</button></li>`)
			},
			error: function () {
				console.warn('Error')
			}
		})
	});

	$list.delegate('.delete-task', 'click', function () {

		let $clickedTodo = $(this).closest('li');
		$.ajax({
			type: 'DELETE',
			url: 'http://localhost:3000/todos/' + $clickedTodo.attr('data-id'),
			success: function () {
				$clickedTodo.fadeOut(100, function () {
					$(this).remove()
				})
			}
		})
	})

	$list.delegate('.set-status', 'click', function () {
		let $newArray = todos.flat(1)
		let index = this.closest('li').id
		let $clickedTodo = $(this).closest('li').attr('data-id');
		$.ajax({
			type: 'PATCH',
			url: 'http://localhost:3000/todos/' + $clickedTodo,
			header: {
				'Access-Control-Allow-Methods': 'PATCH',
			},
			data: {
				complited: $newArray[index].complited === true ? false : true,
			},
			success: function () {
				$newArray[index].complited = $newArray[index].complited === true ? false : true
			},
			error: function () {
				console.warn('Error')
			}
		})
	})
})