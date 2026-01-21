from typing import List, Optional
from sqlmodel import Session, select
from src.models.task import Task
from src.schemas.task import TaskCreate, TaskUpdate

class TaskService:
    def __init__(self, session: Session):
        self.session = session

    def create_task(self, task_create: TaskCreate, user_id: str) -> Task:
        task = Task(**task_create.model_dump(), user_id=user_id)
        self.session.add(task)
        self.session.commit()
        self.session.refresh(task)
        return task

    def get_task_by_id(self, task_id: int, user_id: str) -> Optional[Task]:
        task = self.session.get(Task, task_id)
        if task and str(task.user_id) == str(user_id):
            return task
        return None

    def get_user_tasks(
        self,
        user_id: str,
        status: Optional[str] = None,
        priority: Optional[int] = None,
        search: Optional[str] = None,
        sort_by: Optional[str] = None,
        sort_order: Optional[str] = None,
    ) -> List[Task]:
        query = select(Task).where(Task.user_id == str(user_id))

        if status:
            query = query.where(Task.status == status)
        if priority:
            query = query.where(Task.priority == priority)
        if search:
            query = query.where(
                (Task.title.ilike(f"%{search}%")) | (Task.description.ilike(f"%{search}%"))
            )

        if sort_by:
            if sort_order == "desc":
                query = query.order_by(getattr(Task, sort_by).desc())
            else:
                query = query.order_by(getattr(Task, sort_by).asc())

        tasks = self.session.exec(query).all()
        return tasks

    def update_task(self, task_id: int, task_update: TaskUpdate, user_id: str) -> Optional[Task]:
        task = self.session.get(Task, task_id)
        if task and str(task.user_id) == str(user_id):
            task_data = task_update.model_dump(exclude_unset=True)
            for key, value in task_data.items():
                setattr(task, key, value)
            self.session.add(task)
            self.session.commit()
            self.session.refresh(task)
            return task
        return None

    def delete_task(self, task_id: int, user_id: str) -> bool:
        task = self.session.get(Task, task_id)
        if task and str(task.user_id) == str(user_id):
            self.session.delete(task)
            self.session.commit()
            return True
        return False
