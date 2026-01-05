from typing import List, Optional
from sqlmodel import Session, select
from backend.src.models.task import Task
from backend.src.schemas.task import TaskCreate, TaskUpdate

class TaskService:
    def __init__(self, session: Session):
        self.session = session

    def create_task(self, task_create: TaskCreate, user_id: int) -> Task:
        task = Task(**task_create.model_dump(), user_id=user_id)
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def get_task_by_id(self, task_id: int, user_id: int) -> Optional[Task]:
        task = self.session.get(Task, task_id)
        if task and task.user_id == user_id:
            return task
        return None

    def get_user_tasks(self, user_id: int) -> List[Task]:
        tasks = self.session.exec(select(Task).where(Task.user_id == user_id)).all()
        return tasks

    def update_task(self, task_id: int, task_update: TaskUpdate, user_id: int) -> Optional[Task]:
        task = self.session.get(Task, task_id)
        if task and task.user_id == user_id:
            task_data = task_update.model_dump(exclude_unset=True)
            for key, value in task_data.items():
                setattr(task, key, value)
            self.session.add(task)
            self.session.commit()
            self.session.refresh(task)
            return task
        return None

    def delete_task(self, task_id: int, user_id: int) -> bool:
        task = self.session.get(Task, task_id)
        if task and task.user_id == user_id:
            self.session.delete(task)
            self.session.commit()
            return True
        return False
